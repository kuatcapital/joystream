/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * List of assets to upload/reupload
 */
export interface Assets {
  /**
   * Target bag id
   */
  bagId: string
  /**
   * List of assets to upload
   */
  assets: {
    /**
     * Already existing data object ID
     */
    objectId: string
    /**
     * Path to the content file (relative to input json file)
     */
    path: string
  }[]
  [k: string]: unknown
}
