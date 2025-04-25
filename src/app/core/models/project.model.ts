export enum ProjectStatus {
  ACTIVE = 'Activo',
  FINISHED = 'Finalizado',
  STOPPED = 'Parado',
  SUPPORT = 'Soporte'
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  assignedDeveloper: string;
} 