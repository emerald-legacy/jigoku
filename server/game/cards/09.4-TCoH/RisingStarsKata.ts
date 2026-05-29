import { CardTypes, Durations } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';

export default class RisingStarsKata extends DrawCard {
    static id = 'rising-stars-kata';
    private eventRegistrar?: EventRegistrar;

    private duelWinnersThisConflict = new Set<BaseCard>();

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);

        this.action<DrawCard>({
            title: 'Give a participating unique character +3 military skill',

            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isUnique() && card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    duration: Durations.UntilEndOfConflict,
                    effect: context.target && this.duelWinnersThisConflict.has(context.target)
                        ? AbilityDsl.effects.modifyMilitarySkill(5)
                        : AbilityDsl.effects.modifyMilitarySkill(3)
                }))
            },
            effect: 'give {0} +{1} {2} skill until the end of the conflict',
            effectArgs: (context) => [context.target && this.duelWinnersThisConflict.has(context.target) ? 5 : 3, 'military'],
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    public onConflictFinished() {
        this.duelWinnersThisConflict.clear();
    }

    public afterDuel(event: any) {
        if(event.duel?.winner) {
            const winners: BaseCard[] = Array.isArray(event.duel.winner) ? event.duel.winner : [event.duel.winner];
            winners.forEach((duelWinner) => this.duelWinnersThisConflict.add(duelWinner));
        }
    }
}
