import { CardType, EventName, Players } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import { cardCannot } from '../../../effects.js';
import { cardLastingEffect, conditional, multiple, noAction, ready } from '../../../GameActions/GameActions.js';
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

        this.conflictAction('Prevent opponent\'s bow and move effects')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('duelist') || card.isFaction('crane')
            }, multiple([
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: 'sendHome',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                })),
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: 'moveToConflict',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                })),
                cardLastingEffect((context) => ({
                    effect: cardCannot({
                        cannot: 'bow',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    })
                })),
                conditional({
                    condition: (context) => context.target !== undefined && this.bowedCharactersThisConflict.has(context.target),
                    trueGameAction: ready((context) => ({ target: context.target })),
                    falseGameAction: noAction()
                })
            ]))
            .effect('{1}prevent opponents\' actions from bowing or moving {0}', (context) => (context.target && this.bowedCharactersThisConflict.has(context.target) ? 'ready and ' : ''));
    }

    public onConflictFinished() {
        this.bowedCharactersThisConflict.clear();
    }

    public onCardBowed(event: EventPayload<EventName.OnCardBowed>) {
        this.bowedCharactersThisConflict.add(event.card);
    }
}
