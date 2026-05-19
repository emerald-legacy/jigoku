import DrawCard from '../../drawcard.js';
import { Durations, Locations, Elements } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

const elementKey = 'feral-ningyo-water';

class FeralNingyo extends DrawCard {
    static id = 'feral-ningyo';

    setupCardAbilities() {
        this.action({
            title: 'Put into play',
            condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
            location: [Locations.Hand, Locations.PlayArea],
            effect: '{1}return {0} to the deck at the end of the conflict',
            effectArgs: context => [context.source.location !== Locations.PlayArea ? ['put {0} into play into the conflict and ', context.source] : ''],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.putIntoConflict(context => ({
                    target: context.source
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    location: [Locations.Hand, Locations.PlayArea],
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: '{0} returns to the deck and shuffles due to its delayed effect',
                        messageArgs: context => [context.source],
                        gameAction: AbilityDsl.actions.returnToDeck({ shuffle: true })
                    })
                }))
            ])
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Elements.Water
        });
        return symbols;
    }
}


export default FeralNingyo;
