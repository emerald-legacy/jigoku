import AbilityDsl from './abilitydsl.js';
import type { AbilityContext } from './AbilityContext.js';
import type BaseCard from './basecard.js';
import { CardTypes, Players } from './Constants.js';
import type DrawCard from './drawcard.js';
import type Game from './game.js';
import { InitiateDuel } from './Interfaces.js';

interface InitiateDuelHelperProps {
    initiateDuel?: InitiateDuel | ((context: AbilityContext) => InitiateDuel);
    condition?: (context: AbilityContext) => boolean;
    target?: Record<string, unknown>;
    targets?: Record<string, Record<string, unknown>>;
}

export const initiateDuel = (game: Game, card: BaseCard, properties: InitiateDuelHelperProps): void => {
    if(properties.initiateDuel) {
        if(card.type === CardTypes.Character) {
            initiateDuelFromCharacter(game, card as DrawCard, properties);
        } else {
            initiateDuelFromOther(game, card, properties);
        }
    }
};

const checkChallengerCondition = (card: DrawCard, context: AbilityContext, properties: InitiateDuelHelperProps): boolean => {
    const requiresConflict = getProperty(properties, context, 'requiresConflict');
    const challengerCondition = getProperty(properties, context, 'challengerCondition');

    // default target condition
    if(!challengerCondition) {
        return !requiresConflict || card.isParticipating();
    }
    return (challengerCondition as (card: DrawCard, context: AbilityContext) => boolean)(card, context);
};

const initiateDuelFromCharacter = (_game: Game, card: DrawCard, properties: InitiateDuelHelperProps): void => {
    let prevCondition = properties.condition;
    properties.condition = (context: AbilityContext) => {
        const abilityCondition = (!prevCondition || prevCondition(context));
        const challengerCondition = checkChallengerCondition(card, context, properties);
        return abilityCondition && challengerCondition;
    };
    properties.target = {
        ...getBaselineDuelTargetProperties(card, properties),
        gameAction: AbilityDsl.actions.duel((context: AbilityContext) => {
            const duelProperties = getProperty(properties, context) as InitiateDuel;
            return Object.assign({ challenger: context.source }, duelProperties);
        })
    };
};

const initiateDuelFromOther = (_game: Game, _card: BaseCard, properties: InitiateDuelHelperProps): void => {
    properties.targets = {
        challenger: {
            cardType: CardTypes.Character,
            player: (context: AbilityContext) => {
                const opponentChoosesChallenger = getProperty(properties, context, 'opponentChoosesChallenger');
                return opponentChoosesChallenger ? Players.Opponent : Players.Self;
            },
            controller: Players.Self,
            cardCondition: (card: DrawCard, context: AbilityContext) => checkChallengerCondition(card, context, properties)
        },
        duelTarget: {
            dependsOn: 'challenger',
            ...getBaselineDuelTargetProperties(undefined, properties),
            gameAction: AbilityDsl.actions.duel((context: AbilityContext) => {
                const duelProperties = getProperty(properties, context) as InitiateDuel;
                return Object.assign({ challenger: context.targets.challenger }, duelProperties);
            })
        }
    };
};

const getBaselineDuelTargetProperties = (challenger: DrawCard | undefined, properties: InitiateDuelHelperProps) => {
    const props = {
        cardType: CardTypes.Character,
        player: (context: AbilityContext) => {
            const opponentChoosesDuelTarget = getProperty(properties, context, 'opponentChoosesDuelTarget');
            return opponentChoosesDuelTarget ? Players.Opponent : Players.Self;
        },
        controller: Players.Opponent,
        cardCondition: (card: DrawCard, context: AbilityContext) => {
            const challengerCard = challenger ?? context.targets.challenger;

            if(challengerCard === card) {
                return false;
            }
            const requiresConflict = getProperty(properties, context, 'requiresConflict');
            const targetCondition = getProperty(properties, context, 'targetCondition');
            // default target condition
            if(!targetCondition) {
                return !requiresConflict || card.isParticipating();
            }
            return (targetCondition as (card: DrawCard, context: AbilityContext) => boolean)(card, context);
        }
    };
    return props;
};

const getProperty = (properties: InitiateDuelHelperProps, context: AbilityContext, propName?: keyof InitiateDuel) => {
    let duelProperties: InitiateDuel;

    if(typeof properties.initiateDuel === 'function') {
        duelProperties = properties.initiateDuel(context);
    } else {
        duelProperties = properties.initiateDuel ?? ({} as InitiateDuel);
    }

    // default values
    duelProperties = {
        requiresConflict: true,
        ...duelProperties
    };

    if(!propName) {
        return duelProperties;
    }

    return duelProperties?.[propName];
};
