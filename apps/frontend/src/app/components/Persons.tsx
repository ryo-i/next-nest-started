"use client";

import React, { useEffect, useState } from 'react';

type Person = {
  id: number;
  name: string;
};

const Persons = () => {
  const [persons, setPersons] = useState<Person[]>([]); // 型を指定

  useEffect(() => {
    // APIを呼び出してデータを取得
    const fetchPersons = async () => {
      try {
        const response = await fetch('http://localhost:3001/persons');
        if (!response.ok) {
          throw new Error('Failed to fetch persons');
        }
        const data: Person[] = await response.json(); // 型を指定
        setPersons(data);
      } catch (error) {
        console.error('Error fetching persons:', error);
      }
    };

    fetchPersons();
  }, []);

  return (
    <div>
      <h1>人物一覧</h1>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Persons;