interface MockPlayer {
    name: string;
    opponent?: MockPlayer;
}

interface PlayerHarness {
    player: MockPlayer & { opponent: MockPlayer };
    opponent: MockPlayer;
}

export function buildPlayerHarness(): PlayerHarness {
    const opponent: MockPlayer = { name: "opp" };
    const player = { name: "self", opponent };
    return { player, opponent };
}

export function buildGameSpy<K extends string>(
    methods: readonly K[]
): jasmine.SpyObj<Record<K, jasmine.Spy>> {
    return jasmine.createSpyObj(
        "game",
        methods as readonly string[]
    ) as jasmine.SpyObj<Record<K, jasmine.Spy>>;
}

const baseGameActionMethods = [
    "setDefaultTarget",
    "canAffect",
    "hasLegalTarget",
    "addEventsToArray",
    "hasTargetsChosenByInitiatingPlayer",
    "allTargetsLegal"
] as const;

type BaseGameActionMethod = typeof baseGameActionMethods[number];

export function buildGameActionSpy<E extends string = never>(
    extras: readonly E[] = []
): jasmine.SpyObj<Record<BaseGameActionMethod | E, jasmine.Spy>> {
    const methodNames: ReadonlyArray<string> = [...baseGameActionMethods, ...extras];
    const spy = jasmine.createSpyObj(
        "gameAction",
        methodNames
    ) as jasmine.SpyObj<Record<BaseGameActionMethod | E, jasmine.Spy>>;
    spy.canAffect.and.returnValue(true);
    spy.hasLegalTarget.and.returnValue(true);
    spy.allTargetsLegal.and.returnValue(true);
    return spy;
}

export function lastPromptArgs<T = unknown>(spy: jasmine.Spy): T {
    return spy.calls.mostRecent().args[1] as T;
}

export function lastPromptPlayer<T = unknown>(spy: jasmine.Spy): T {
    return spy.calls.mostRecent().args[0] as T;
}
