export const apiEndpoint = "http://0.0.0.0:8000";

import { useState } from "react";
import Bmob from "hydrogen-js-sdk";

// CREATE
export const useCreateItem = (tableName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItem = async (data: any) => {
    setIsLoading(true);
    const query = Bmob.Query(tableName);
    Object.keys(data).forEach((key) => {
      query.set(key, data[key]);
    });

    query
      .save()
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        return res;
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setIsLoading(false);
      });
  };

  return { createItem, isLoading, error };
};

// READ
export const useReadAllItems = (tableName: string) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const readItems = async () => {
    setIsLoading(true);
    const query = Bmob.Query(tableName);

    query
      .find()
      .then((res) => {
        console.log(res);
        setItems(res as any);
        setIsLoading(false);
        return res;
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setIsLoading(false);
      });
  };

  return { items, readItems, isLoading, error };
};

// UPDATE
export const useUpdateItem = (tableName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateItem = async (objectId: string, data: any) => {
    setIsLoading(true);
    const query = Bmob.Query(tableName);
    Object.keys(data).forEach((key) => {
      query.set(key, data[key]);
    });

    query
      .save()
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        return res;
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setIsLoading(false);
      });
  };

  return { updateItem, isLoading, error };
};

// DELETE
export const useDeleteItem = (tableName: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteItem = async (objectId: string) => {
    setIsLoading(true);
    const query = Bmob.Query(tableName);

    query
      .destroy(objectId)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setIsLoading(false);
      });
  };

  return { deleteItem, isLoading, error };
};
