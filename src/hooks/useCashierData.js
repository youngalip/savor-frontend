import { useState, useEffect } from 'react';
import cashierApi from '../services/cashierApi';

export const useCashierData = (filters = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cashierApi.getOrders(filters);
      setOrders(response.data || []);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  return { 
    orders, 
    loading, 
    error, 
    refetch: fetchOrders 
  };
};