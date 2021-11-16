import { ApolloType as AT } from "@apollo-api/core/dist/Apollo";
import { Minerva } from "@apollo-api/minerva";
import { ConnectionNames } from "../MinervaConfig";

export interface ApolloType extends AT{
    db :Minerva<ConnectionNames>
}
