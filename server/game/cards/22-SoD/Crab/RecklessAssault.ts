import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { Durations } from '../../../Constants';

export default class RecklessAssault extends DrawCard {
    static id = 'reckless-assault';

    setupCardAbilities() {
        this.reaction({
            title: 'Force defenders',
            when: {
                onConflictDeclared: (event, context) =>
                    context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 &&
                    context.game.currentConflict.getParticipants(
                        (participant) => participant.hasTrait('berserker') && participant.controller === context.player
                    ).length === 1 &&
                    context.player === context.game.currentConflict.attackingPlayer
            },
            effect: 'prevent characters with less than 3{1} from defending (this affects {2})',
            effectArgs: (context) => ['military', this.getCharacters(context)],
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: this.getCharacters(context),
                duration: Durations.UntilEndOfConflict,
                effect: AbilityDsl.effects.cardCannot('declareAsDefender')
            }))
        });
    }

    getCharacters(context) {
        const cards = context.player.opponent && context.player.opponent.cardsInPlay.filter(card => card.getMilitarySkill() < 3);
        return cards;
    }
}
