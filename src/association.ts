/** Contains the association types. */
import * as _ from 'lodash';

import { defineAssociation } from './metadata';
import { Model, ModelConstructor } from './model';
import { Property } from './property';

/** A type of association between models. */
export enum AssociationType {
  HAS_ONE,
  HAS_MANY,
  BELONGS_TO,
  BELONGS_TO_MANY
}

// Promote association types to top level so they are usable as squell.HAS_ONE, like normal attr types.
export const HAS_ONE = AssociationType.HAS_ONE;
export const HAS_MANY = AssociationType.HAS_MANY;
export const BELONGS_TO = AssociationType.BELONGS_TO;
export const BELONGS_TO_MANY = AssociationType.BELONGS_TO_MANY;

/**
 * An association of a model.
 * This is acts no differently than an attribute for now.
 */
export class Association<T> extends Property<T> {
  /** The association type. */
  private type: AssociationType;

  /** The association name. */
  private name: string;

  /**
   * Construct an association.
   *
   * @param type The association type.
   * @param name The association name.
   */
  constructor(type: AssociationType, name: string) {
    super();

    this.type = type;
    this.name = name;
  }

  /**
   * Turns the association into its relevant property name.
   *
   * @returns The property name.
   */
  public toString(): string {
    return this.name;
  }
}

/** The options that can be defined for an association. */
export interface AssociationOptions {
  /** The type of association. */
  type?: AssociationType;

  /** The target model of the association. */
  target?: AssociationTarget<any>;
}

/** The assoations defined on a model. */
export interface ModelAssociations {
  [key: string]: AssociationOptions;
}

/**
 * A target for an association. This can either
 * be a specific model or a function that lazily
 * loads the target model.
 *
 * The lazy load method can be used when there is circular dependency
 * issues.
 */
export type AssociationTarget<T extends Model> = ModelConstructor<T> | (() => ModelConstructor<T>);

/**
 * A decorator for a model association.
 * The association has a type and the model to associate to.
 * All association properties must be defined using this decorator in order
 * to be recognised by ModelSafe.
 *
 * Here the target is optional incase it is yet to be defined.
 * Once it has been defined, it can be correctly reassociated with
 * a target model using `Model.assocate`.
 *
 * @see `Model.associate`
 * @param type    The type of association.
 * @param target  The target model to associate to.
 * @param options Any extra Sequelize attribute options required.
 */
export function assoc<T extends Model>(type: AssociationType, target?: AssociationTarget<T>, options?: AssociationOptions) {
  return (ctor: Object, key: string | symbol) => defineAssociation(ctor, key, { ... options, type, target });
}
