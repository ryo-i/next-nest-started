export type Person = {
  id: number;
  name: string;
};

export type CreatePersonDto = {
  name: string;
};

export type UpdatePersonDto = {
  name?: string;
};
