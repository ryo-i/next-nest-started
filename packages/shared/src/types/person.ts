/**
 * Person リソースの共通レスポンス型。
 * フロントエンドとバックエンドで同じ形を参照するために共有します。
 */
export type Person = {
  id: number;
  name: string;
};

/**
 * Person 作成時の入力型。
 * API の POST /persons で利用します。
 */
export type CreatePersonDto = {
  name: string;
};

/**
 * Person 更新時の入力型。
 * 部分更新を想定して name を任意にしています。
 */
export type UpdatePersonDto = {
  name?: string;
};
