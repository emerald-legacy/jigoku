import { cardCannot, modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect, multiple, onAffinity } from '../../../GameActions/GameActions.js';
import { CardType, EventName, Players, RestrictionType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import { msg } from '../../../GameChat.js';

const controlledBy = (player: Player) => (character: DrawCard) => character.controller === player;

const trigger = {
    onConflictDeclared: {
        when: (event: EventPayload<EventName.OnConflictDeclared>, context: TriggeredAbilityContext) => (event.attackers ?? []).some(controlledBy(context.player)),
        cardCondition: (card: DrawCard, context: TriggeredAbilityContext) => (context.event.attackers ?? []).includes(card)
    },
    onDefendersDeclared: {
        when: (event: EventPayload<EventName.OnDefendersDeclared>, context: TriggeredAbilityContext) => event.defenders.some(controlledBy(context.player)),
        cardCondition: (card: DrawCard, context: TriggeredAbilityContext) => (context.event.defenders ?? []).includes(card)
    },
    onMoveToConflict: {
        when: (event: EventPayload<EventName.OnMoveToConflict>, context: TriggeredAbilityContext) => controlledBy(context.player)(event.card),
        cardCondition: (card: DrawCard, context: TriggeredAbilityContext) => context.event.card === card
    }
};

export default class SanctifiedEarth extends DrawCard {
    static id = 'sanctified-earth';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'shugenja', myControl: true });

        this.reaction('Give character a skill bonus')
            .when({
                onConflictDeclared: trigger.onConflictDeclared.when,
                onDefendersDeclared: trigger.onDefendersDeclared.when,
                onMoveToConflict: trigger.onMoveToConflict.when
            })
            .target({
                cardType: CardType.Character,
                player: Players.Self,
                cardCondition: (card, context) => Object.entries(trigger).find(([name]) => name === context.event.name)?.[1].cardCondition(card, context) ?? false
            }, multiple([
                cardLastingEffect({
                    effect: modifyBothSkills(2)
                }),

                onAffinity({
                    trait: 'earth',
                    chatText: 'make {0} invulnerable to opponent\'s send home',
                    chatTextArgs: (context) => [context.target],
                    gameAction: cardLastingEffect((context) => ({
                        target: context.target,
                        effect: cardCannot({
                            cannot: RestrictionType.SendHome,
                            restricts: 'opponentsCardEffects'
                        })
                    }))
                })
            ]))
            .chatText((context) => msg`give +2${'military'} and +2${'political'} to ${context.target}`);
    }
}
