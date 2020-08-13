import { container } from "tsyringe";

import IHashProvider from "./models/IHashProvider";
import BCryptHashProvider from "./implementation/BCryptHashProvider";

container.registerSingleton<IHashProvider>(
  'HashProvider', BCryptHashProvider
)