import DrawCard from '../../drawcard';
import { Locations, TargetModes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';
import { shuffle } from '../../utils/shuffle';

class AnOceanInADrop extends DrawCard {
    static id = 'an-ocean-in-a-drop';

    setupCardAbilities() {
        this.action({
            title: 'Place hand on bottom of deck and draw cards',
            condition: context => context.source.parent && context.source.parent.isParticipating(),
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetModes.Select,
                targets: true,
                choices:  {
                    [this.owner.name]: AbilityDsl.actions.sequential(this.getGameActions(this.owner)),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.sequential(this.getGameActions(this.owner.opponent))
                }
            },
            effect: 'place {1}\'s hand on the bottom of their deck and have them draw {2} cards',
            effectArgs: (context) => (context.select === this.owner.name || !this.owner.opponent) ?
                [this.owner.name, context.player.hand.length] :
                [this.owner.opponent.name, context.player.opponent.hand.length]
        });
    }

    getGameActions(player) {
        if(!player) {
            return [];
        }
        return [
            AbilityDsl.actions.moveCard(() => ({
                shuffle: false,
                bottom: true,
                destination: Locations.ConflictDeck,
                target: shuffle(player.hand)
            })),
            AbilityDsl.actions.draw((context) => ({ target: player, amount: context.events.length }))
        ];
    }
}


export default AnOceanInADrop;
