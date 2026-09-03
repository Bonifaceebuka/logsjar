import { Container, Service } from "typedi";

export const iocContainer = {
    get<T>(someClass: { new(...args: any[]): T }): T {
        return Container.get(someClass);
    }
};
