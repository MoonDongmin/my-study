import {BadRequestException, HttpException, Injectable, UnauthorizedException} from '@nestjs/common';
import {CatRequestDto} from "../dto/cat.request.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Cat} from "../cats.schema";
import * as bcrypt from 'bcrypt';
import {CatsRepository} from "../cats.repository";


@Injectable()
export class CatsService {
    constructor(
        private readonly catsRepository: CatsRepository,
    ) {
    }

    async signUp(body: CatRequestDto) {
        const {email, name, password} = body;
        const isCatExist = await this.catsRepository.existsByEmail(email);

        if (isCatExist) {
            throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const cat = await this.catsRepository.create({
            email,
            name,
            password: hashedPassword
        });

        return cat.readOnlyData;
    }

    async uploadImg(cat: Cat, file: any) {
        const fileName = file.key;

        console.log(fileName);
        const newCat = await this.catsRepository.findByIdAndUploadImg(
            cat.id,
            fileName,
        );
        console.log(newCat);
        return newCat;
    }

    async getAllCat() {
        const allCat = await this.catsRepository.findAll();
        const readOnlyCat = allCat.map((cat) => cat.readOnlyData);
        return readOnlyCat;
    }
}
