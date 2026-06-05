import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Decks, Duration, PlayType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { PlayCharacterAsIfFromHandAtHome } from '../../../PlayCharacterAsIfFromHand.js';

export default class AgashaAyako extends DrawCard {
    static id = 'agasha-ayako';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                onCardPlayed: (event, context) => event.card === context.source
            },
            effect: 'search their dynasty deck for a character',
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Choose a character to play',
                deck: Decks.DynastyDeck,
                cardCondition: (card) => card.type === CardType.Character && (card.printedCost ?? 0) <= 2 && !card.isUnique(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playerLastingEffect((context) => ({
                        targetController: context.player,
                        duration: Duration.UntilSelfPassPriority,
                        effect: AbilityDsl.effects.reduceCost({
                            match: (card) => card === context.deckSearchSelected[0],
                            amount: 1
                        })
                    })),
                    AbilityDsl.actions.playCard((context) => {
                        const target = context.deckSearchSelected[0];
                        return {
                            target,
                            source: this,
                            resetOnCancel: false,
                            playType: PlayType.Other,
                            playAction: target ? [new PlayCharacterAsIfFromHandAtHome(target)] : undefined,
                            ignoredRequirements: ['phase']
                        };
                    })
                ])
            })
        });
    }
}
