import { Logger } from '@nestjs/common';
import { Map as MapDB, MapImage, User } from '@prisma/client';
import { EMapStatus, EMapType } from '../../enums/map.enum';
import { UserDto } from '../user/user.dto';
import { MapImageDto } from './mapImage.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsString } from 'class-validator';

export class MapDto implements MapDB {
    @ApiProperty()
    @IsInt()
    id: number;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEnum(EMapType)
    type: EMapType;

    @ApiProperty()
    @IsEnum(EMapStatus)
    statusFlag: EMapStatus;

    @ApiProperty()
    @IsString()
    downloadURL: string;

    @ApiProperty()
    @IsString() // Could use IsHash?
    hash: string;

    @ApiProperty()
    @IsInt()
    submitterID: number;

    @ApiProperty()
    @IsInt()
    thumbnailID: number;

    submitter: UserDto;
    images: MapImageDto[];
    thumbnail: MapImageDto;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    constructor(_map: MapDB, _submitter?: User, _images?: MapImage[]) {
        console.log(JSON.stringify(_map));

        let submitter = _submitter;
        if (submitter == null) {
            // if null then try get it from map object
            submitter = (_map as any).user;
        }
        console.log(JSON.stringify(submitter));

        let images = _images;
        if (images == null || images.length == 0) {
            // if null then try get it from map object
            images = (_map as any).images?.length == 0 ? null : (_map as any).images;
        }
        console.log(JSON.stringify(images));

        this.id = _map.id;
        this.name = _map.name;
        this.type = _map.type;
        this.statusFlag = _map.statusFlag;
        this.downloadURL = _map.downloadURL;
        this.hash = _map.hash;
        this.createdAt = _map.createdAt;
        this.updatedAt = _map.updatedAt;
        this.submitterID = _map.submitterID;
        this.thumbnailID = _map.thumbnailID;

        this.submitter = new UserDto(submitter);

        if (images != null && images.length > 0) {
            this.images = [];

            images.forEach((image) => {
                const dto = new MapImageDto(image);
                this.images.push(dto);

                if (dto.id === this.thumbnailID) {
                    this.thumbnail = dto;
                }
            });
        }
    }
}