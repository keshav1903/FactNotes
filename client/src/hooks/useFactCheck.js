import { useState, useCallback } from 'react';
import { factCheckAPI } from '../services/api';
import { debounce } from '../utils/helpers';

export const useFactCheck = () => {
  const [corrections, setCorrections] = useState({});
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Debounced fact-check function
  const debouncedFactCheck = useCallback(
    debounce(async (sentence, callback) => {
      try {
        setLoading(true);
        const response = await factCheckAPI.checkSentence(sentence);
        const result = {
          sentence: response.data.sentence,
          corrections: response.data.corrections,
          hasIssues: response.data.hasIssues,
          checkedAt: response.data.checkedAt
        };

        setCorrections(prev => ({
          ...prev,
          [sentence]: result.corrections
        }));

        if (callback) callback(result);
      } catch (error) {
        console.error('Fact-check error:', error);
        // Silently fail for better UX
      } finally {
        setLoading(false);
      }
    }, 3000),
    []
  );

  // Check sentence immediately (no debounce)
  const checkSentence = useCallback(async (sentence) => {
    try {
      setLoading(true);
      const response = await factCheckAPI.checkSentence(sentence);
      const result = {
        sentence: response.data.sentence,
        corrections: response.data.corrections,
        hasIssues: response.data.hasIssues,
        checkedAt: response.data.checkedAt
      };

      setCorrections(prev => ({
        ...prev,
        [sentence]: result.corrections
      }));

      return result;
    } catch (error) {
      console.error('Fact-check error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Batch check multiple sentences
  const batchCheck = useCallback(async (sentences) => {
    try {
      setLoading(true);
      const response = await factCheckAPI.batchCheck(sentences);

      // Update corrections state with all results
      const newCorrections = {};
      response.data.results.forEach(result => {
        newCorrections[result.sentence] = result.corrections;
      });

      setCorrections(prev => ({
        ...prev,
        ...newCorrections
      }));

      return response.data;
    } catch (error) {
      console.error('Batch fact-check error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check and save for specific note
  const checkForNote = useCallback(async (noteId, sentence) => {
    try {
      const response = await factCheckAPI.checkForNote(noteId, sentence);
      const result = {
        sentence: response.data.sentence,
        corrections: response.data.corrections,
        hasIssues: response.data.hasIssues,
        savedToNote: response.data.savedToNote
      };

      setCorrections(prev => ({
        ...prev,
        [sentence]: result.corrections
      }));

      return result;
    } catch (error) {
      console.error('Note fact-check error:', error);
      throw error;
    }
  }, []);

  // Get fact-check history
  const getHistory = useCallback(async (params = {}) => {
    try {
      const response = await factCheckAPI.getHistory(params);
      setHistory(response.data.history);
      return response.data;
    } catch (error) {
      console.error('History fetch error:', error);
      throw error;
    }
  }, []);

  // Clear corrections
  const clearCorrections = useCallback(() => {
    setCorrections({});
  }, []);

  // Get corrections for a sentence
  const getCorrections = useCallback((sentence) => {
    return corrections[sentence] || [];
  }, [corrections]);

  // Check if sentence has issues
  const hasIssues = useCallback((sentence) => {
    const sentenceCorrections = corrections[sentence];
    return sentenceCorrections && sentenceCorrections.length > 0;
  }, [corrections]);

  return {
    corrections,
    loading,
    history,
    debouncedFactCheck,
    checkSentence,
    batchCheck,
    checkForNote,
    getHistory,
    clearCorrections,
    getCorrections,
    hasIssues
  };
};

export default useFactCheck;
