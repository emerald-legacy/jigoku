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

type SpiedMethods<K extends string> = Record<K, jasmine.Spy>;

export function buildGameSpy<K extends string>(
    methods: readonly K[]
): jasmine.SpyObj<SpiedMethods<K>> {
    return jasmine.createSpyObj("game", methods);
}

const baseGameActionMethods = [
    "canAffect",
    "hasLegalTarget",
    "addEventsToArray",
    "hasTargetsChosenByInitiatingPlayer",
    "allTargetsLegal"
] as const;

type BaseGameActionMethod = typeof baseGameActionMethods[number];

export function buildGameActionSpy<E extends string = never>(
    extras: readonly E[] = []
): jasmine.SpyObj<SpiedMethods<BaseGameActionMethod | E>> {
    const methodNames: ReadonlyArray<BaseGameActionMethod | E> = [...baseGameActionMethods, ...extras];
    const spy: jasmine.SpyObj<SpiedMethods<BaseGameActionMethod | E>> = jasmine.createSpyObj("gameAction", methodNames);
    spy.canAffect.and.returnValue(true);
    spy.hasLegalTarget.and.returnValue(true);
    spy.allTargetsLegal.and.returnValue(true);
    return spy;
}

export function lastPromptArgs(spy: jasmine.Spy): unknown {
    return spy.calls.mostRecent().args[1];
}

export function lastPromptPlayer(spy: jasmine.Spy): unknown {
    return spy.calls.mostRecent().args[0];
}
