import { ArmObj } from '../models/arm-obj';
import { UserAssignedIdentity } from '../pages/app/deployment-center/DeploymentCenter.types';
import { CommonConstants } from '../utils/CommonConstants';
import MakeArmCall from './ArmHelper';

export default class ManagedIdentityService {
  public static getUserAssignedIdentity = (
    resourceId: string,
    apiVersion = CommonConstants.ApiVersions.managedIdentityApiVersion20230131
  ) => {
    return MakeArmCall<ArmObj<UserAssignedIdentity>>({
      method: 'GET',
      resourceId: resourceId,
      commandName: 'getUserAssignedIdentityInfo',
      apiVersion,
    });
  };

  public static createUserAssignedIdentity = (
    resourceGroupId: string,
    identityName: string,
    location: string,
    apiVersion = CommonConstants.ApiVersions.managedIdentityApiVersion20230131
  ) => {
    const resourceId = `${resourceGroupId}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/${identityName}`;
    const body = {
      location,
    };

    return MakeArmCall<ArmObj<UserAssignedIdentity>, { location: string }>({
      method: 'PUT',
      resourceId: resourceId,
      commandName: 'createUserAssignedIdentity',
      body: body,
      apiVersion,
    });
  };

  public static readonly OIDCFederatedCredentials = {
    issuer: 'https://token.actions.githubusercontent.com',
    audiences: ['api://AzureADTokenExchange'],
  };

  public static async putFederatedCredential(
    managedIdentityResourceId: string,
    credentialName: string,
    fullRepoName: string,
    apiVersion = CommonConstants.ApiVersions.managedIdentityApiVersion20230131
  ) {
    const federatedCredentialResourceId = `${managedIdentityResourceId}/federatedIdentityCredentials/${credentialName}`;
    const body = {
      properties: {
        issuer: this.OIDCFederatedCredentials.issuer,
        subject: `repo:${fullRepoName}:environment:production`,
        audiences: this.OIDCFederatedCredentials.audiences,
      },
    };

    return MakeArmCall({
      method: 'PUT',
      resourceId: federatedCredentialResourceId,
      body: body,
      commandName: 'putFederatedCredential',
      apiVersion,
    });
  }
}
