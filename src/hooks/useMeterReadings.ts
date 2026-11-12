import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { MeterReading } from '@/lib/supabase';

interface UseMeterReadingsResult {
  readings: MeterReading[];
  latest: MeterReading | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const FETCH_LIMIT = 100;

export function useMeterReadings(): UseMeterReadingsResult {
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchReadings = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('meter_readings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(FETCH_LIMIT);

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (!data) {
      setError('No data returned');
      setLoading(false);
      return;
    }
    setReadings(data as MeterReading[]);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReadings();

    const channel = supabase
      .channel('meter_readings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meter_readings',
        },
        (payload) => {
          const newReading = payload.new as MeterReading;
          setReadings((prev) => {
            if (prev.some((r) => r.id === newReading.id)) return prev;
            return [newReading, ...prev].slice(0, FETCH_LIMIT);
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'meter_readings',
        },
        (payload) => {
          const oldId = (payload.old as { id?: string })?.id;
          if (!oldId) {
            fetchReadings();
            return;
          }
          setReadings((prev) => prev.filter((r) => r.id !== oldId));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchReadings]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchReadings();
  }, [fetchReadings]);

  return {
    readings,
    latest: readings.length > 0 ? readings[0] : null,
    loading,
    error,
    refresh,
  };
}
