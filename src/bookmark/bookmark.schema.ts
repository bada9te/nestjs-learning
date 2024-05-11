import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type BookmarkDocument = HydratedDocument<Bookmark>;


@Schema()
export class Bookmark {
    @Prop({ required: true })
    title: string;
}


export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);