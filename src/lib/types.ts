export interface Item {
  id: string;
  name: string;
  quantity: number;
  imageUrl?: string;
  addedAt: string;
}

export interface Container {
  id: string;
  name: string;
  items: Item[];
  nfcId?: string;
  parentId?: string;
  allowedContentType: 'items' | 'containers';
}
