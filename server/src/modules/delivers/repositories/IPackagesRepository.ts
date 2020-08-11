import { Deliver } from "../infra/typeorm/entities/Deliver";
import { Package } from "../infra/typeorm/entities/Package";

interface IPackageDTO {
  product: string,
  latitude: number,
  longitude: number,
  deliver: Deliver
}

export default interface IPackagesRepository {
  create(data: IPackageDTO): Promise<Package>;
  find(delive: Deliver): Promise<Package[]>;
}