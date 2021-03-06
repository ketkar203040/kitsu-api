import { BASE_URL, ApiResponse } from './constants';
import Axios from 'axios';
import QueryString from 'qs';

interface CategoryFilters {
  parentId?: string | number;
  slug?: string;
  nsfw?: boolean;
}

interface CategoryAttributes {
  createdAt: string,
  updatedAt: string,
  title: string,
  description: string | null,
  totalMediaCount: number,
  nsfw: boolean,
  slug: string | null,
  childCount: number,
  image: any | null
}

interface CategoryItem {
  id: string
  type: 'categories',
  links: {self: string},
  attributes: CategoryAttributes,
  relationships: any,
}

const CATEGORIES_URL = BASE_URL + '/categories';

class FetchCategory {
  private url: string = CATEGORIES_URL;
  private nextUrl?: string;

  constructor(options?: {
    filter?: CategoryFilters,
    sort?: string,
    include?: string,
    page?: {limit?: number, offset?: number}
  }) {
    
    const filterString: string = QueryString.stringify(
      options,
      { encode: false }
    );

    this.url = CATEGORIES_URL + '?' + filterString;
  }

  /**
   * Executes query and fetches the first page of results.
   */
  public async exec(): Promise<ApiResponse<CategoryItem[]>> {
    try {
      const res = await Axios.get(this.url);
      this.nextUrl = res.data.links.next || undefined;
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Fetches the next page of results if exists.
   */
  public async next(): Promise<ApiResponse<CategoryItem[]> | undefined> {
    if (!this.nextUrl) {
      return Promise.resolve(undefined);
    }
    try {
      const res = await Axios.get(this.nextUrl);
      this.nextUrl = res.data.links.next || undefined;
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default class Categories {
  /**
   * Search categories.
   * @param filters
   */
  fetch(options?: {
    filter?: CategoryFilters,
    sort?: string,
    include?: string,
    page?: {limit?: number, offset?: number}
  }): FetchCategory {
    return new FetchCategory(options);
  }

  /**
   * Fetch category by id.
   * @param id The unique id of a category.
   */
  async fetchById(id: number | string): Promise<ApiResponse<CategoryItem>> {
    try {
      const res = await Axios.get(CATEGORIES_URL + '/' + id);
      return Promise.resolve(res.data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
