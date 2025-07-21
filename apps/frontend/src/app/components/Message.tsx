"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Message() {
  const [message, setMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios.get(apiUrl as string)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, [apiUrl]);

  return <div>{message}</div>;
}