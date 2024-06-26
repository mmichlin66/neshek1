/**
 * Represents simple language scalar types allowed for object properties.
 */
export type ScalarLangType = string | number| bigint | boolean;

/**
 * Represents NULL language types. This just combines `null` and `undefined`.
 */
export type NullLangType = null | undefined;

/**
 * Represents language-specific scalar types used to work with class properties.
 */
export type LangType = ScalarLangType | {[P: string]: LangType} | LangType[] | NullLangType;



/**
 * Represents data types corresponding to string property types:
 *   - "str" - string
 *   - "clob" - character-based large object
 */
export type StringDataType = "str" | "clob";

/**
 * Represents data types corresponding to temporal property types:
 *   - "date" - date only
 *   - "time" - time only
 *   - "datetime" - datetime
 *   - "timestamp" - timestamp
 */
export type TemporalDataType = "date" | "time" | "datetime" | "timestamp";

/**
 * Represents underlying data types corresponding to integer property types:
 *   - "int" - signed or unsigned integer of different sizes
 *   - "bigint" - signed or unsigned integer of different sizes
 *   - "bit" - bit-values
 *   - "year" - 4-digit year
 */
export type IntegerDataType = "int" | "bigint" | "bit" | "year";

/**
 * Represents underlying data types corresponding to real (floating or fixed point) property types:
 *   - "real" - floating-point numbers of single or double precision
 *   - "dec" - fixed-point numbers (DECIMAL/NUMERIC)
 */
export type RealDataType = "real" | "dec"

/**
 * Represents underlying data types corresponding to big integer property types:
 *   - "bigint" - signed or unsigned integer of different sizes
 *   - "bit" - bit-values
 */
export type BigintDataType = "bigint" | "bit";

/**
 * Combines integer and real data types in one definition for convenience
 */
export type NumericDataType = IntegerDataType | RealDataType

/**
 * Represents underlying data types corresponding to Boolean property types:
 *   - "bool" - boolean
 */
export type BoolDataType ="bool";

/**
 * Represents underlying data types corresponding to any property types except Boolean:
 */
export type NonBoolDataType = StringDataType | NumericDataType | TemporalDataType;

/**
 * Combines data types representing scalar values.
 */
export type ScalarDataType = StringDataType | NumericDataType | TemporalDataType | BoolDataType;

/**
 * Represents underlying data types corresponding to property types:
 * - string properties:
 *   - "str" - string
 *   - "clob" - character-based large object
 *   - "date" - date only
 *   - "time" - time only
 *   - "datetime" - datetime
 *   - "timestamp" - timestamp
 * - numeric properties
 *   - "int" - signed or unsigned integer of different sizes
 *   - "real" - floating-point numbers of single or double precision
 *   - "dec" - fixed-point numbers (DECIMAL/NUMERIC)
 *   - "year" - 4-digit year
 * - bigint properties
 *   - "bigint" - signed or unsigned integer of different sizes
 *   - "bit" - bit-values
 * - boolean properties
 *   - "bool" - boolean
 * - Special properties
 *   - "link" - single link
 *   - "multilink" - multi-link
 *   - "obj" - structured object
 *   - "arr" - array
 */
export type DataType = ScalarDataType | "link" | "multilink" | "obj" | "arr" | "any";



/**
 * Represents possible types of properties in primary keys and unique constraints. These can be
 * one of the following:
 * - Simple scalar types: string, number, boolean, bigint and Date
 * - Class types, which represent single links
 */
export type KeyPropDataType = ScalarDataType | ClassDef;

/**
 * Represents a structure (object) where keys are strings and values are one of the property types
 * allowed in primary keys and unique constraints.
 */
export type KeyDataType = { [P: string]: KeyPropDataType }



/** Combines Data and language types */
export type DataOrLangType = DataType | LangType;



/**
 * Represents data type corresponding to the given language type
 */
export type DataTypeOf<T extends LangType> =
    // T extends SqlTime ? "time" :
    T extends string ? "str" | "clob" | "date" | "time" | "datetime" | "timestamp" :
    T extends number ? "int" | "real" | "dec" | "year" :
    T extends bigint ? "bigint" | "bit" :
    T extends boolean ? "bool" :
    T extends Array<LangType> ? "multilink" | "arr" :
    T extends Record<string,LangType> ? "link" | "obj" :
    undefined



/**
 * Maps data types to language types used to represent them.
 */
export type LangTypeOf<DT extends DataType | undefined | null> =
    DT extends StringDataType | TemporalDataType ? string :
    DT extends BigintDataType ? bigint : // this line must be before NumericDataType to take effect
    DT extends NumericDataType ? number :
    DT extends BoolDataType ? boolean :
    DT extends undefined ? undefined :
    DT extends null ? null :
    DT extends "multilink" | "arr" ? LangType[] :
    DT extends "link" | "obj" ? Record<string,LangType> :
    never;



export type ClassDef =
{
    /** Class name */
    name: string;

    /** Primary key type; `true` means the class has the standard i8 key named "id" */
    key?: KeyDataType | true;

    /** Unique constraints */
    unique?: KeyDataType[];
}



/**
 * Defines property definition attributes that are common for all data types
 */
export type CommonPropDef =
{
    /**
     * Property's data type that determines its structure and meaning.
     */
    dt: DataType,

    /**
     * Determines whether the field must have a non-null value in the repository.
     * Default value: false.
     */
    required?: boolean;

    /**
     * Determines whether the field value must be unique across all objects of its class.
     * Default value: false.
     */
    unique?: boolean;
}

/**
 * Contains attributes defining behavior of a string property
 */
export type StringPropDef = CommonPropDef &
{
    dt: "str";
    minlen?: number;
    maxlen?: number;
    regex?: RegExp;
    choices?: string[];
}

/**
 * Contains attributes defining behavior of a CLOB property
 */
export type ClobPropDef = CommonPropDef &
{
    dt: "clob";
    minlen?: number;
    maxlen?: number;
}

/**
 * Contains attributes defining behavior of an integer number property
 */
export type IntPropDef = CommonPropDef &
{
    dt: "int";
    min?: number;
    max?: number;
    step?: number;
}

/**
 * Contains attributes defining behavior of a BigInt property
 */
export type BigIntPropDef = CommonPropDef &
{
    dt: "bigint";
    min?: bigint;
    max?: bigint;
}

/**
 * Contains attributes defining behavior of a floating-point real number property
 */
export type RealPropDef = CommonPropDef &
{
    dt: "real";
    precision?: number;
    min?: number;
    max?: number;
}

/**
 * Contains attributes defining behavior of a fixed-point real property
 */
export type DecimalPropDef = CommonPropDef &
{
    dt: "dec";
    precision?: number | [number, number];
    min?: number;
    max?: number;
}

/**
 * Contains attributes defining behavior of a bit-value property
 */
export type BitValuePropDef = CommonPropDef &
{
    dt: "bit";
    size?: number;
}

/**
 * Contains attributes defining behavior of a Boolean property
 */
export type BoolPropDef = CommonPropDef &
{
    dt: "bool";
}

/**
 * Contains attributes defining behavior of a date-only property
 */
export type DatePropDef = CommonPropDef &
{
    dt: "date";
}

/**
 * Contains attributes defining behavior of a time-only property
 */
export type TimePropDef = CommonPropDef &
{
    dt: "time";
    precision?: number;
}

/**
 * Contains attributes defining behavior of a date-time property
 */
export type DateTimePropDef = CommonPropDef &
{
    dt: "datetime";
    precision?: number;
}

/**
 * Contains attributes defining behavior of a TIMESTAMP property
 */
export type TimestampPropDef = CommonPropDef &
{
    dt: "timestamp";
    precision?: number;
}

/**
 * Contains attributes defining behavior of a YEAR property
 */
export type YearPropDef = CommonPropDef &
{
    dt: "year";
}

// /**
//  * Contains attributes defining behavior of a structure property
//  */
// export type ArrayPropDef<M extends AModel, E> = CommonPropDef &
// {
//     dt: "arr";
//     elm: PropDef<M, E>;
// }

/**
 * Helper type with all template parameters set to `any`. This is needed for easier referencing
 * in other type definitions.
 */
export type ALinkPropDef = CommonPropDef &
{
    dt: "link";
    target: string;
}

// /**
//  * Contains attributes defining behavior of a single link property.
//  * @typeParam PN class that is a target of the link.
//  */
// export type LinkPropDef<M extends AModel, PN extends ModelClassName<M>> = ALinkPropDef &
// {
//     target: PN;
// }

// /**
//  * Helper type with all template parameters set to `any`. This is needed for easier referencing
//  * in other type definitions.
//  */
// export type AMultiLinkPropDef = CommonPropDef &
// {
//     dt: "multilink";
//     origin: string;
//     originKey: string;
// }

// /**
//  * Contains attributes defining behavior of a multi link property pointing to a class or crosslink.
//  * @typeParam TClass class that is a target of the multi link; that is, the origin of the
//  * corresponding single link.
//  *
//  */
// export type MultiLinkPropDef<M extends AModel, CN extends ModelClassName<M>> = AMultiLinkPropDef &
// {
//     origin: CN;
//     originKey: string & keyof ModelClassProps<M,CN>;
// }
// // export type MultiLinkPropDef<M extends AModel, C extends AClass> = AMultiLinkPropDef &
// // {
// //     origin: NameOfClass<C>;
// //     originKey: string & keyof ModelClassProps<M, NameOfClass<C>>;
// // }

// /**
//  * Contains attributes defining behavior of a structure property
//  */
// export type StructPropDef<M extends AModel, T> = CommonPropDef & {dt: "obj"} & (
//     T extends Struct<infer TName> ? TName extends ModelStructName<M> ? {name: TName} : never :
//     T extends StructDataType ? {props: StructDef<M, T>} :
//     never
// )

// /**
//  * Helper type with all template parameters set to `any`. This is needed for easier referencing
//  * in other type definitions.
//  */
// export type APropDef = StringPropDef | DatePropDef | TimePropDef | DateTimePropDef |
//     IntPropDef | BigIntPropDef | RealPropDef | DecimalPropDef | BitValuePropDef | TimestampPropDef |
//     BoolPropDef | ArrayPropDef<AModel,any> | ALinkPropDef | AMultiLinkPropDef;

// /**
//  * Represents attributes defining behavior of a property of a given type.
//  */
// export type PropDef<M extends AModel, T> =
// (
//     T extends "str" ? StringPropDef :
//     T extends "clob" ? ClobPropDef :
//     T extends "date" ? DatePropDef :
//     T extends "time" ? TimePropDef :
//     T extends "datetime" ? DateTimePropDef :
//     T extends "timestamp" ? TimestampPropDef :
//     T extends "year" ? YearPropDef :
//     T extends "int" ? IntPropDef :
//     T extends "real" ? RealPropDef :
//     T extends "dec" ? DecimalPropDef :
//     T extends "bit" ? BitValuePropDef :
//     T extends "bigint" ? BigIntPropDef :
//     T extends "bool" ? BoolPropDef :
//     T extends Array<infer E> ? ArrayPropDef<M,E> :
//     T extends MultiLink<infer C> ? C extends Class<infer CN, any, any>
//         ? CN extends ModelClassName<M> ? MultiLinkPropDef<M,CN> : never : never :
//     T extends Class<infer CN, any, any> ? CN extends ModelClassName<M>
//         ? LinkPropDef<M,CN> : never :
//     never
// );

// /**
//  * Helper type with all template parameters set to `any`. This is needed for easier referencing
//  * in other type definitions.
//  */
// export type AStructDef = { [P: string]: APropDef }

// /**
//  * Represents definition of a structured type, which defines property names and corresponding
//  * property definitions. Structure definitions can be used to define class properties or to
//  * serve as a "base" for a class. In the latter case, the class will have all the proprties
//  * that the structure defines.
//  */
// export type StructDef<M extends AModel, SN extends ModelStructName<M>> =
// {
//     [P in string & keyof ModelStruct<M,SN>]-?: PropDef<M, ModelStruct<M,SN>[P]>
// }

// /**
//  * Represents definition of a class.
//  */
// export type AClassDef =
// {
//     base?: string | string[];

//     /**
//      * Defenitions of class properties
//      */
//     props: { [P: string]: APropDef };

//     /**
//      * Defines what fields constitute a primary key for the class. The key can be a single field
//      * or a collection of fields.
//      */
//     key?: string[];

//     /**
//      * If the class is declared abstract, no instances of it can be created in the repository.
//      * It can only be used as a base for other classes.
//      */
//     abstract?: boolean;
// }

// /**
//  * Represents definition of a class with proper template parameters.
//  */
// export type ClassDef<M extends AModel, CN extends ModelClassName<M>> =
// {
//     /**
//      * Defines one or more base classes or structures.
//      */
//     base?: ModelClassName<M> | ModelClassName<M>[];

//     /**
//      * Defenitions of class properties
//      */
//     props: { [P in ModelClassPropName<M,CN>]-?: PropDef<M, ModelClassProps<M,CN>[P]> };

//     /**
//      * Defines what fields constitute a primary key for the class. The key can be a single field
//      * or a collection of fields.
//      */
//     key?: (string & keyof ModelClassKey<M,CN>)[];
//     // the following is commented out although it defines the proper tuple type; however, the
//     // correct order of properties in the tuple is non-deterministic and the compiler sometimes
//     // fails.
//     // key?: KeysToTuple<ModelClassKey<M,CN>>;

//     /**
//      * If the class is declared abstract, no instances of it can be created in the repository.
//      * It can only be used as a base for other classes.
//      */
//     abstract?: boolean;
// }

// /**
//  * Represents a Schema, which combines definitions of classes, structures and type aliases.
//  */
// export type ASchemaDef =
// {
//     classes: { [CN: string]: AClassDef }
//     structs: { [SN: string]: AStructDef}
// }

// /**
//  * Represents a Schema, which combines definitions of classes, structures and type aliases.
//  */
// export type SchemaDef<M extends AModel> = ASchemaDef &
// {
//     classes: { [CN in ModelClassName<M>]: ClassDef<M, CN> }
//     structs: { [SN in ModelStructName<M>]: StructDef<M, SN>}
// }



