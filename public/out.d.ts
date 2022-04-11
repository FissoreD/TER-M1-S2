declare module "automaton/Automaton" {
    export class State {
        isAccepting: boolean;
        isInitial: boolean;
        alphabet: string[];
        transitions: Map<string, State[]>;
        name: string;
        constructor(name: string, isAccepting: boolean, isInitial: boolean, alphabet: string[]);
        addTransition(symbol: string, state: State): void;
    }
    export interface AutomatonJson {
        states: Map<string, State>;
        initialStates: State[];
        acceptingStates: State[];
        alphabet: string[];
    }
    export class Automaton implements AutomatonJson {
        states: Map<string, State>;
        initialStates: State[];
        acceptingStates: State[];
        alphabet: string[];
        currentStates: State[];
        states_rename: Map<string, State>;
        constructor(json: AutomatonJson);
        set_state_rename(): void;
        next_step(next_char: string): void;
        accept_word(word: string): boolean;
        accept_word_nfa(word: string): boolean;
        findTransition(state: State, symbol: string): State[];
        restart(): void;
        draw_next_step(next_char: string): void;
        initiate_graph(): void;
        get_current_graph_node(node: State): ChildNode;
        matrix_to_mermaid(): string;
        color_node(toFill: boolean): void;
        create_triple(states: string, transition: string): string;
        create_entering_arrow(): string;
        get_state_rename(name: string): State;
        state_number(): number;
        transition_number(): any;
    }
}
declare module "automaton/automaton_type" {
    import { Automaton } from "automaton/Automaton";
    interface HisTransition {
        fromState: number;
        toStates: number[];
        symbol: string;
    }
    interface HisAutomaton {
        alphabet: string[];
        initialState?: number | number[];
        states: number[];
        transitions: HisTransition[];
        acceptingStates: number[];
    }
    export function HisAutomaton2Mine(aut: HisAutomaton): Automaton;
    export function MyAutomatonToHis(aut: Automaton): HisAutomaton;
    export function regexToAutomaton(regex: string): Automaton;
    export function minimizeAutomaton(automaton: HisAutomaton): Automaton;
    export function intersectionAutomata(a1: Automaton, a2: Automaton): Automaton;
    export function unionAutomata(a1: Automaton, a2: Automaton): Automaton;
    export function complementAutomata(a1: Automaton): Automaton;
    export function differenceAutomata(a1: Automaton, a2: Automaton): Automaton;
}
declare module "tools/Utilities" {
    export type myFunction<S, T> = {
        (data: S): T;
    };
    export function same_vector(v1: any[], v2: any[]): boolean;
    export const generate_prefix_list: (str: string) => string[];
    export const generate_suffix_list: (str: string) => string[];
    export const count_str_occurrences: (str: string, obj: string) => number;
    export function boolToString(bool: boolean): string;
}
declare module "teacher/TeacherAutomaton" {
    import { Automaton } from "automaton/Automaton";
    import { Teacher } from "teacher/Teacher";
    export class TeacherAutomaton implements Teacher {
        alphabet: string[] | string;
        regex: string;
        description: string;
        automaton: Automaton;
        constructor(regex: string, description?: string);
        member(sentence: string): string;
        equiv(automaton: Automaton): string | undefined;
    }
}
declare module "teacher/TeacherNoAutomaton" {
    import { Automaton } from "automaton/Automaton";
    import { myFunction } from "tools/Utilities";
    import { Teacher } from "teacher/Teacher";
    export class TeacherNoAutomaton implements Teacher {
        static counter: number;
        check_function: myFunction<string, boolean>;
        counter_exemples: string[];
        counter: number;
        description: string;
        alphabet: string[] | string;
        max_word_length: number;
        regex: string;
        constructor(params: {
            regex: string | myFunction<string, boolean>;
            counter_exemples: string[];
            alphabet: string[] | string;
        }, description?: string);
        initiate_mapping(): [string, boolean][];
        member(sentence: string): string;
        equiv(automaton: Automaton): string | undefined;
    }
}
declare module "teacher/Teacher" {
    import { Automaton } from "automaton/Automaton";
    import { TeacherAutomaton } from "teacher/TeacherAutomaton";
    import { TeacherNoAutomaton } from "teacher/TeacherNoAutomaton";
    export interface Teacher {
        description: string;
        alphabet: string | string[];
        regex: string;
        member(sentence: string): string;
        equiv(automaton: Automaton): string | undefined;
    }
    export let teacher_a_or_baStar: TeacherAutomaton;
    export let teacherPairZeroAndOne: TeacherAutomaton;
    export let teacherA3fromLast: TeacherAutomaton;
    export let teacherEvenAandThreeB: TeacherAutomaton;
    export let teacherNotAfourthPos: TeacherAutomaton;
    export let teacher_bStar_a_or_aStart_bStar: TeacherNoAutomaton;
    export let teacher_b_bStar_a__b_aOrb_star: TeacherAutomaton;
    export let binaryAddition: TeacherNoAutomaton;
    export let teachers: (TeacherAutomaton | TeacherNoAutomaton)[];
}
declare module "lerners/LernerBase" {
    import { Automaton } from "automaton/Automaton";
    import { Teacher } from "teacher/Teacher";
    export type Map_string_string = {
        [key: string]: string;
    };
    export abstract class LernerBase {
        alphabet: string[];
        E: string[];
        S: string[];
        SA: string[];
        observation_table: Map_string_string;
        teacher: Teacher;
        member_number: number;
        equiv_number: number;
        finish: boolean;
        automaton: undefined | Automaton;
        constructor(teacher: Teacher);
        update_observation_table(key: string, value: string): void;
        make_member(pref: string, suff: string): void;
        make_equiv(a: Automaton): string | undefined;
        add_elt_in_S(new_elt: string, after_member?: boolean): string[];
        add_row(row_name: string, after_member?: boolean): void;
        move_from_SA_to_S(elt: string): void;
        add_column(new_col: string): void;
        make_next_query(): void;
        make_all_queries(): void;
        abstract table_to_update_after_equiv(answer: string): void;
        abstract make_automaton(): Automaton;
        abstract is_close(): string | undefined;
        abstract is_consistent(): string[] | undefined;
        same_row(a: string, b: string): boolean;
    }
}
declare module "lerners/L_star" {
    import { Automaton } from "automaton/Automaton";
    import { Teacher } from "teacher/Teacher";
    import { LernerBase } from "lerners/LernerBase";
    export class L_star extends LernerBase {
        constructor(teacher: Teacher);
        update_observation_table(key: string, value: string): void;
        make_member(pref: string, suff: string): void;
        make_equiv(a: Automaton): string | undefined;
        make_automaton(): Automaton;
        is_close(): string | undefined;
        is_consistent(): string[] | undefined;
        same_row(a: string, b: string): boolean;
        table_to_update_after_equiv(answer: string): void;
    }
}
declare module "html_interactions/HTML_LernerBase" {
    import { Automaton } from "automaton/Automaton";
    import { LernerBase } from "lerners/LernerBase";
    import { myFunction } from "tools/Utilities";
    export abstract class HTML_LernerBase<Lerner extends LernerBase> {
        lerner: Lerner;
        table_header: HTMLTableSectionElement;
        table_body: HTMLTableSectionElement;
        pile_actions: myFunction<void, void>[];
        automaton: Automaton | undefined;
        table_counter: number;
        constructor(lerner: Lerner);
        draw_table(): void;
        add_row_html(parent: HTMLTableSectionElement, fst: string | undefined, head: string | undefined, row_elts: string[], colspan?: number, rowspan?: number): HTMLTableRowElement;
        clear_table(): void;
        graphic_next_step(): void;
        close_action(): boolean;
        consistence_action(): boolean;
        send_automaton_action(): void;
        abstract close_message(close_rep: string): string;
        abstract consistent_message(s1: string, s2: string, new_col: string): string;
        abstract table_to_update_after_equiv(answer: string): void;
        add_automaton_listener(): void;
        go_to_end(): void;
    }
}
declare module "html_interactions/HTML_L_star" {
    import { Teacher } from "teacher/Teacher";
    import { L_star } from "lerners/L_star";
    import { HTML_LernerBase } from "html_interactions/HTML_LernerBase";
    export class HTML_L_star extends HTML_LernerBase<L_star> {
        constructor(teacher: Teacher);
        close_message(close_rep: string): string;
        consistent_message(s1: string, s2: string, new_col: string): string;
        table_to_update_after_equiv(answer: string): void;
    }
}
declare module "lerners/NL_star" {
    import { Automaton } from "automaton/Automaton";
    import { Teacher } from "teacher/Teacher";
    import { LernerBase } from "lerners/LernerBase";
    export class NL_star extends LernerBase {
        prime_lines: string[];
        constructor(teacher: Teacher);
        is_prime(row_key: string): boolean;
        row_union(row1: string, row2: string): string;
        is_covered(row1: string, row2: string): boolean;
        check_prime_lines(): void;
        add_elt_in_S(new_elt: string): string[];
        add_elt_in_E(new_elt: string): void;
        is_close(): string | undefined;
        is_consistent(): string[] | undefined;
        make_automaton(): Automaton;
        table_to_update_after_equiv(answer: string): void;
    }
}
declare module "html_interactions/HTML_NL_star" {
    import { Teacher } from "teacher/Teacher";
    import { NL_star } from "lerners/NL_star";
    import { HTML_LernerBase } from "html_interactions/HTML_LernerBase";
    export class HTML_NL_star extends HTML_LernerBase<NL_star> {
        constructor(teacher: Teacher);
        add_row_html(parent: HTMLTableSectionElement, fst: string | undefined, head: string | undefined, row_elts: string[], colspan?: number, rowspan?: number): HTMLTableRowElement;
        close_message(close_rep: string): string;
        consistent_message(s1: string, s2: string, new_col: string): string;
        table_to_update_after_equiv(answer: string): void;
    }
}
declare module "Main" {
    import { Teacher } from "teacher/Teacher";
    import { Automaton } from "automaton/Automaton";
    export let automatonDiv: HTMLDivElement, message: HTMLParagraphElement, tableHTML: HTMLTableElement, automatonHTML: HTMLDivElement, automatonDivList: [Automaton, Node][];
    export function initiate_global_vars(): void;
    export function clear_automaton_HTML(): void;
    global {
        interface Window {
            Automaton: any;
            teachers: Teacher[];
            L_star: any;
            NL_star: any;
            autFunction: any;
            automatonDivList: [Automaton, Node][];
        }
    }
}
declare module "MyString" {
    export class MyString extends String {
        private prefix_list;
        private suffix_list;
        constructor(entry: string);
        static generate_prefix_list: (str: string) => string[];
        static generate_suffix_list: (str: string) => string[];
        is_prefix(str: String): boolean;
        is_suffix(str: String): boolean;
    }
}
declare module "html_interactions/listeners" {
    import { Automaton } from "automaton/Automaton";
    export function listener_automaton_click_button(a: Automaton): void;
    export function set_text(): void;
}
declare module "lerners/Observation_table" {
    export class Observation_table {
        private columns;
        private rows;
        private matrix;
        constructor();
        add_column(column_name: string): void;
        add_row(row_name: string): void;
        set_value(row_name: string, column_name: string, bool: boolean): void;
        get_value(row_name: string, column_name: string): boolean;
        get_row(row_name: string): boolean[];
        same_row(row1: string, row2: string): boolean;
    }
}
declare module "test_nodejs/Automaton_minimize_test" { }
declare module "test_nodejs/PrintFunction" {
    import { L_star } from "lerners/L_star";
    import { NL_star } from "lerners/NL_star";
    import { LernerBase } from "lerners/LernerBase";
    export let printInfo: (algo: LernerBase, algoName: string) => string;
    export let printCsvCompare: (L: L_star, NL: NL_star) => string;
    export let csvHead: string;
    export let clearFile: (fileName: string) => void;
    export let writeToFile: (fileName: string, content: string) => void;
}
declare module "test_nodejs/LernerCompare" { }
declare module "test_nodejs/Test_wrost_DFA" { }
