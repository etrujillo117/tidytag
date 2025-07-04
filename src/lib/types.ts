export interface Item {
  id: string;
  name: string;
  quantity: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Container {
  id: string;
  name: string;
  items: Item[];
  nfcId?: string;
  parentId?: string;
  allowedContentType: 'items' | 'containers';
  createdAt: string;
  updatedAt: string;
}
