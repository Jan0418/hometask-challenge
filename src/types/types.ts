export interface RepositoryData {
  user: {
    repositories: {
      nodes: Repository[];
      pageInfo: {
        endCursor: string | null;
      };
      totalCount: number;
    };
  };
}

export interface Repository {
  id: string;
  name: string;
  stargazerCount: number;
  forkCount: number;
  url: string;
}
