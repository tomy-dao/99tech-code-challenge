import Task, { ITask } from '../models/Task';

export interface BaseQuery<T = any> {
  query?: T;
  limit: number;
  skip: number;
}

export interface TaskQuery extends BaseQuery {
  query?: {
    completed?: boolean | undefined;
    search?: string | undefined;
  }
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
}

export const queryTasks = async (query: TaskQuery, hasCount: boolean = false): Promise<{ tasks: ITask[], total: number }> => {
  const { query: { completed, search } = { completed: undefined, search: undefined }, limit, skip } = query;

  const filter: any = {};

  if (completed !== undefined && completed !== null) {
    filter.completed = completed;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  let total = 0;

  if (hasCount) {
    total = await Task.countDocuments(filter);
  }

  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();

  return {
    tasks,
    total
  };
};

export const getTask = async (id: string): Promise<ITask | null> => {
  return await Task.findById(id).exec();
};

export const createTask = async (taskData: CreateTaskData): Promise<ITask> => {
  const task = new Task(taskData);
  const data = await task.save();
  console.log({data});  
  return data;
};

export const updateTask = async (id: string, updateData: UpdateTaskData): Promise<ITask | null> => {
  const task = await getTask(id);
  if (!task) return null;

  task.set(updateData);
  return await task.save();
};

export const deleteTask = async (id: string): Promise<ITask | null> => {
  return await Task.findByIdAndDelete(id).exec();
};
