"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
/**
 * Controllers for everything tenant releated.  Wrapping in anonymous function to inject
 * models and services (we could look into DI instead).
 *
 * Figure out how to break this into multiple files, if this gets too big.
 */
exports.default = ({ manager }) => {
    let TenantController = class TenantController {
        /**
         * Retrieves a service schema that was built with a specific application.
         */
        async getApplicationServices(id, applicationId, serviceId, serviceVersion) {
            // /tenant/modal/applications/0e490da4-6038-43f7-9761-abded79b2536/services/session/v1/schema
            try {
                const services = await manager.application.getServices(id, applicationId);
                if (!services[serviceId]) {
                    throw new routing_controllers_1.NotFoundError(`Service ${serviceId} does not exist.`);
                }
                const version = services[serviceId].flows.find(flow => flow.key === serviceVersion);
                if (!version) {
                    throw new routing_controllers_1.NotFoundError(`Service version ${serviceVersion} for service ${serviceId} does not exist.`);
                }
                return version.schema;
            }
            catch ({ message, code }) {
                if (code === 'NoSuchKey') {
                    throw new routing_controllers_1.NotFoundError('Tenant or application does not exist.');
                }
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
        /**
         * Retrieves a service schema that was built with a specific application version.
         */
        async getVersionedApplicationServices(id, applicationId, versionId, serviceId, serviceVersion) {
            try {
                const services = await manager.application.getServices(id, applicationId, versionId);
                if (!services[serviceId]) {
                    throw new routing_controllers_1.NotFoundError(`Service ${serviceId} does not exist.`);
                }
                const version = services[serviceId].flows.find(flow => flow.key === serviceVersion);
                if (!version) {
                    throw new routing_controllers_1.NotFoundError(`Service version ${serviceVersion} for service ${serviceId} does not exist.`);
                }
                return version.schema;
            }
            catch ({ message, code }) {
                if (code === 'NoSuchKey') {
                    throw new routing_controllers_1.NotFoundError('Tenant or application does not exist.');
                }
                throw new routing_controllers_1.InternalServerError(message);
            }
        }
    };
    __decorate([
        routing_controllers_1.Get('/:id/applications/:appId/services/:serviceId/:serviceVersion/schema'),
        __param(0, routing_controllers_1.Param('id')),
        __param(1, routing_controllers_1.Param('appId')),
        __param(2, routing_controllers_1.Param('serviceId')),
        __param(3, routing_controllers_1.Param('serviceVersion'))
    ], TenantController.prototype, "getApplicationServices", null);
    __decorate([
        routing_controllers_1.Get('/:id/applications/:appId/:version/services/:serviceId/:serviceVersion/schema'),
        __param(0, routing_controllers_1.Param('id')),
        __param(1, routing_controllers_1.Param('appId')),
        __param(2, routing_controllers_1.Param('version')),
        __param(3, routing_controllers_1.Param('serviceId')),
        __param(4, routing_controllers_1.Param('serviceVersion'))
    ], TenantController.prototype, "getVersionedApplicationServices", null);
    TenantController = __decorate([
        routing_controllers_1.Controller('/tenant'),
        routing_controllers_1.JsonController()
    ], TenantController);
    return TenantController;
};
//# sourceMappingURL=Controller.js.map