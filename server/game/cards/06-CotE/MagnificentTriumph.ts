import { CardType, EventName, Players } from '../../Constants.js';
import type { Duel } from '../../Duel.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class MagnificentTriumph extends DrawCard {
    static id = 'magnificent-triumph';
    private eventRegistrar?: EventRegistrar;

    #duelWinnersThisConflict = new Set<BaseCard>();

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);
        this.action({
            title: 'Give a character +2/+2',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => this.#duelWinnersThisConflict.has(card),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: [
                        AbilityDsl.effects.modifyBothSkills(2),
                        AbilityDsl.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsEvents',
                            applyingPlayer: context.player
                        })
                    ]
                }))
            },
            effect: 'give {0} +2{1}, +2{2}, and prevent them from being targeted by opponent\'s events',
            effectArgs: () => ['military', 'political']
        });
    }

    public onConflictFinished() {
        this.#duelWinnersThisConflict.clear();
    }

    public afterDuel(event: EventPayload<EventName.AfterDuel>) {
        for(const winner of (event.duel as Duel).winner ?? []) {
            this.#duelWinnersThisConflict.add(winner);
        }
    }
}
