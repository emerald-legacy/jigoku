import { CardType, EventName, Players } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class KakitasFirstKata extends DrawCard {
    static id = 'kakita-s-first-kata';

    private bowedCharactersThisConflict = new Set<BaseCard>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnConflictFinished, EventName.OnCardBowed]);

        this.action<DrawCard>({
            title: 'Prevent opponent\'s bow and move effects',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('duelist') || card.isFaction('crane'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'moveToConflict',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.conditional({
                        condition: (context) => context.target !== undefined && this.bowedCharactersThisConflict.has(context.target),
                        trueGameAction: AbilityDsl.actions.ready((context) => ({ target: context.target })),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 })
                    })
                ])
            },
            effect: '{1}prevent opponents\' actions from bowing or moving {0}',
            effectArgs: (context) => (context.target && this.bowedCharactersThisConflict.has(context.target) ? 'ready and ' : '')
        });
    }

    public onConflictFinished() {
        this.bowedCharactersThisConflict.clear();
    }

    public onCardBowed(event: EventPayload<EventName.OnCardBowed>) {
        this.bowedCharactersThisConflict.add(event.card);
    }
}
