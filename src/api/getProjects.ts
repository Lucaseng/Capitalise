import { API_URL } from "./config";

export type TProject = {
  _id: string;
  name: string;
  semester: string;
  repoLink: string;
  likes: number;
  content: [
    {
      tab: [
        {
          photoGallery: [];
          text: string;
          photo: string;
        }
      ];
    }
  ];
  badges: "clientWinner" | "clientRunner" | "peopleWinner" | "peopleRunner";
};

export async function getProjects(): Promise<TProject[]> {
  const response = await fetch(`${API_URL}/api/projects`);
  return response.json();
}
