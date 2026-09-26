import AbilityDsl from './abilitydsl.js';
import type { AbilityContext } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import { CardType, Players } from './Constants.js';
import type DrawCard from './DrawCard.js';
import type Game from './Game.js';
import { InitiateDuel } from './Interfaces.js';
import type { TargetPropertiesInput } from './Interfaces.js';

type DuelSource = InitiateDuel | ((context: AbilityContext) => InitiateDuel);

interface InitiateDuelHelperProps {
    initiateDuel?: DuelSource;
    condition?: (context: AbilityContext) => boolean;
    target?: TargetPropertiesInput;
    targets?: Record<string, TargetPropertiesInput>;
}

export const initiateDuel = (game: Game, card: BaseCard, properties: InitiateDuelHelperProps): void => {
    const source = properties.initiateDuel;
    if(source) {
        if(card.isCharacter()) {
            initiateDuelFromCharacter(game, card, properties, source);
        } else {
            initiateDuelFromOther(game, card, properties, source);
        }
    }
};

/** The duel's properties; a duel requires a conflict unless it says otherwise. */
const duelProperties = (source: DuelSource, context: AbilityContext): InitiateDuel => ({
    requiresConflict: true,
    ...(typeof source === 'function' ? source(context) : source)
});

const checkChallengerCondition = (card: DrawCard, context: AbilityContext, source: DuelSource): boolean => {
    const { requiresConflict, challengerCondition } = duelProperties(source, context);

    // default target condition
    if(!challengerCondition) {
        return !requiresConflict || card.isParticipating();
    }
    return challengerCondition(card, context);
};

const initiateDuelFromCharacter = (_game: Game, card: DrawCard, properties: InitiateDuelHelperProps, source: DuelSource): void => {
    let prevCondition = properties.condition;
    properties.condition = (context: AbilityContext) => {
        const abilityCondition = (!prevCondition || prevCondition(context));
        const challengerCondition = checkChallengerCondition(card, context, source);
        return abilityCondition && challengerCondition;
    };
    properties.target = {
        ...getBaselineDuelTargetProperties(source, card),
        gameAction: AbilityDsl.actions.duel((context: AbilityContext) => {
            return Object.assign({ challenger: context.source }, duelProperties(source, context));
        })
    };
};

const initiateDuelFromOther = (_game: Game, _card: BaseCard, properties: InitiateDuelHelperProps, source: DuelSource): void => {
    properties.targets = {
        challenger: {
            cardType: CardType.Character,
            player: (context: AbilityContext) => {
                return duelProperties(source, context).opponentChoosesChallenger ? Players.Opponent : Players.Self;
            },
            controller: Players.Self,
            cardCondition: (card: DrawCard, context: AbilityContext) => checkChallengerCondition(card, context, source)
        },
        duelTarget: {
            dependsOn: 'challenger',
            ...getBaselineDuelTargetProperties(source),
            gameAction: AbilityDsl.actions.duel((context: AbilityContext) => {
                return Object.assign({ challenger: context.targets.challenger }, duelProperties(source, context));
            })
        }
    };
};

const getBaselineDuelTargetProperties = (source: DuelSource, challenger?: DrawCard) => {
    const props = {
        cardType: CardType.Character,
        player: (context: AbilityContext) => {
            return duelProperties(source, context).opponentChoosesDuelTarget ? Players.Opponent : Players.Self;
        },
        controller: Players.Opponent,
        cardCondition: (card: DrawCard, context: AbilityContext) => {
            const challengerCard = challenger ?? context.targets.challenger;

            if(challengerCard === card) {
                return false;
            }
            const { requiresConflict, targetCondition } = duelProperties(source, context);
            // default target condition
            if(!targetCondition) {
                return !requiresConflict || card.isParticipating();
            }
            return targetCondition(card, context);
        }
    };
    return props;
};
