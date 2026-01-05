import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {

  constructor( 
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) { }

  // Create new role
  async createRole(createRoleDto: CreateRoleDto) {
    try {
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name }
      });

      if (existingRole) {
        throw new ConflictException(`The role with name ${createRoleDto.name} already exists.`);
      }

      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating the role');
    }
  }

  // Get all active roles
  async getAllActiveRoles() {
    try {
      const roles = await this.roleRepository.find({
        where: {
          isActive: true
        }
      });

      if (!roles || roles.length === 0) {
        throw new NotFoundException('Role not found');
      }

      return roles;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching roles.');
    }
  }

  // get all roles (including inactive)
  async getAll() {
    try {
      const roles = await this.roleRepository.find();

      if (!roles || roles.length === 0) {
        throw new NotFoundException('Roles not found.');
      }

      return roles;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching roles.');
    }
  }

  // Get role by id
  async getById(id: number) {
    if (!id) {
      throw new BadRequestException('An id is required.');
    }

    try {
      const roles = await this.roleRepository.findOne({
        where: {
          idRole: id,
          isActive: true
        },
      });

      if (!roles) {
        throw new NotFoundException(`The role with the id ${id} does not exist.`);
      }

      return roles;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching the role by id.');
    }
  }

  // Get role by name
  async getByName(name: string) {
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new BadRequestException('A valid name is required.');
    }

    try {
      const role = await this.roleRepository.findOne({
        where: {
          name: name,
          isActive: true
        }
      });

      if (!role) {
        throw new NotFoundException(`The role with the name "${name}" does not exist.`);
      }

      return role;
    } catch (err: any) {
      if (err.response?.statusCode) throw err;
      throw new InternalServerErrorException('Error fetching the role by name.');
    }
  }

  // Update role
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    if (!updateRoleDto.name || !updateRoleDto.name.trim()) {
      return 'No hay datos para actualizar';
    }

    const result = await this.roleRepository.update(id, {
      name: updateRoleDto.name
    });

    if (result.affected === 0) {
      throw new NotFoundException(`The role with the id ${id} does not exist.`);
    }

    return this.roleRepository.findOneBy({ idRole: id });
  }

  // Soft delete 
  async remove(id: number) {
    const role = await this.roleRepository.findOneBy({ idRole: id });

    if (!role) {
      throw new NotFoundException(`The role with the id ${id} does not exist.`);
    }

    const newIsActiveState = !role.isActive;

    await this.roleRepository.update(id, { isActive: newIsActiveState });

    return { message: `The role with the id ${id} was ${newIsActiveState ? 'activated' : 'deactivated'}.` };
  }
}
