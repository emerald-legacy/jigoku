import { duel } from './GameActions/GameActions.js';
import type { AbilityContext } from './AbilityContext.js';
import type BaseCard from './BaseCard.js';
import { CardType, Players } from './Constants.js';
import type DrawCard from './DrawCard.js';
import { InitiateDuel } from './Interfaces.js';
import type { TargetPropertiesInput } from './Interfaces.js';

type DuelSource = InitiateDuel | ((context: AbilityContext) => InitiateDuel);

interface InitiateDuelHelperProps {
    initiateDuel?: DuelSource;
    condition?: (context: AbilityContext) => boolean;
    target?: TargetPropertiesInput;
    targets?: Record<string, TargetPropertiesInput>;
}

/** The ability's properties with the duel's condition and targets added; `properties` itself is left as written. */
export const initiateDuel = <P extends InitiateDuelHelperProps>(card: BaseCard, properties: P): P => {
    const source = properties.initiateDuel;
    if(!source) {
        return properties;
    }
    return card.isCharacter() ? initiateDuelFromCharacter(card, properties, source) : initiateDuelFromOther(properties, source);
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

const initiateDuelFromCharacter = <P extends InitiateDuelHelperProps>(card: DrawCard, properties: P, source: DuelSource): P => {
    const prevCondition = properties.condition;
    return {
        ...properties,
        condition: (context: AbilityContext) => {
            const abilityCondition = (!prevCondition || prevCondition(context));
            const challengerCondition = checkChallengerCondition(card, context, source);
            return abilityCondition && challengerCondition;
        },
        target: {
            ...getBaselineDuelTargetProperties(source, card),
            gameAction: duel((context: AbilityContext) => {
                return Object.assign({ challenger: context.source }, duelProperties(source, context));
            })
        }
    };
};

const initiateDuelFromOther = <P extends InitiateDuelHelperProps>(properties: P, source: DuelSource): P => ({
    ...properties,
    targets: {
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
            gameAction: duel((context: AbilityContext) => {
                return Object.assign({ challenger: context.targets.challenger }, duelProperties(source, context));
            })
        }
    }
});

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
