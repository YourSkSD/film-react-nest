import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilmDocument = Film & Document;

@Schema({ _id: false })
export class Schedule {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) daytime: string;
  @Prop({ required: true }) hall: number;
  @Prop({ required: true }) rows: number;
  @Prop({ required: true }) seats: number;
  @Prop({ required: true }) price: number;
  @Prop({ type: [String], default: [] }) taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) title: string;
  @Prop() about: string;
  @Prop() description: string;
  @Prop() director: string;
  @Prop({ required: true }) rating: number;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop() image: string;
  @Prop() cover: string;
  @Prop({ type: [ScheduleSchema], default: [] }) schedule: Schedule[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
