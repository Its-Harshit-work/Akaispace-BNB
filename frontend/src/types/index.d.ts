type PreLabel = {
  map_position: string;
  summary: string;
  keywords: string[];
};

type Label = {
  userId: string;
  description: string;
  rating: number;
  audioUrl: string;
};

type Datapoint = {
  _id: string;
  processingStatus: string;
  mediaUrl: string;
  project_id: string;
  task_id: string;
  gameMapping: string;
  preLabel: PreLabel;
  finalLabel: string;
  labels: Label[];
};

type Task = {
  _id: string;
  files: string[];
  size: number;
  startOn: Date;
  endOn?: Date | null;
  creditsNeeded: number;
};

type Instruction = {
  video_url: string;
  label: string;
  markdown: string;
};

type Project = {
  _id: string;
  name: string;
  type: string;
  license: string;
  tasks: Task[];
  progress: boolean;
  preLabelList?: number[];
  finalLabelList?: number[];
  preLabelWindow: Date;
  finalLabelWindow: Date;
  instruction: Instruction;
};

type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  otp?: string | null;
  otpExpiresAt?: Date | null;
  isVerified: boolean;
  createdAt: Date;
  credits: string;
  projects: Project[];
  role: "user" | "enterprise";
  firstName?: string;
  lastName?: string;
  companyName?: string;
  jobTitle?: string;
  workEmail?: string;
  projectBudget?: number;
  descriptionForm?: string;
  hasFilledForm: boolean;
  refreshToken?: string | null;
};

type Dataset = {
  _id: string;
  name: string;
  description: string;
  license: string;
  upvotes: number;
  project_id: string;
  datapoints: string[];
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
};
