import DrawCard from '../../drawcard.js';
import { TargetModes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KiAlignment extends DrawCard {
    static id = 'ki-alignment';

    setupCardAbilities() {
        this.reaction({
            title: 'Search for kihos',
            when: {
                onConflictDeclared: (event: any, context: any) => event.conflict.attackingPlayer === context.player && (event.attackers?.some((card: any) => card.hasTrait('monk')) ?? false),
                onDefendersDeclared: (event: any, context: any) => event.conflict.defendingPlayer === context.player && (event.defenders?.some((card: any) => card.hasTrait('monk')) ?? false)
            },
            effect: 'look at the top eight cards of their deck for up to two kihos',
            gameAction: AbilityDsl.actions.deckSearch({
                targetMode: TargetModes.UpTo,
                amount: 8,
                numCards: 2,
                uniqueNames: true,
                cardCondition: (card: any) => card.hasTrait('kiho'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}


export default KiAlignment;
