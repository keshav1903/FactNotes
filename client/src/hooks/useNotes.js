import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../api';

export const useNotes = () => {
  const [notes, setNotes]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [pagination, setPagination] = useState({
    total: 0, page: 1, pages: 1, hasPrev: false, hasNext: false
  });

  /* ── LIST ─────────────────────────────────────── */
  const fetchNotes = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/notes', { params });
      setNotes(data.data);
      setPagination({
        total  : data.total,
        page   : data.page,
        pages  : data.pages,
        hasPrev: data.page  > 1,
        hasNext: data.page  < data.pages
      });
    } catch (err) {
      console.error(err);
      toast.error('Could not load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── DELETE ───────────────────────────────────── */
  const deleteNote = useCallback(async id => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted');
      fetchNotes({ page: pagination.page });
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  }, [fetchNotes, pagination.page]);

  return { notes, loading, fetchNotes, deleteNote, pagination };
};
