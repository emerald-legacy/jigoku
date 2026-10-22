import { CardSelector } from '../../server/game/CardSelector.js';
import { CardType, TargetMode } from '../../server/game/Constants.js';
import { AbilityContext } from '../../server/game/AbilityContext.js';
import { createTestGame, testPlayer } from '../helpers/fixtures.js';

describe('CardSelector prompt titles', function () {
    let context: AbilityContext;

    beforeEach(function () {
        const game = createTestGame();
        context = new AbilityContext({ game, player: testPlayer(game) });
    });

    it('names the card type of an up to selector', function () {
        expect(CardSelector.for({ mode: TargetMode.UpTo, numCards: 2, cardType: CardType.Attachment }).defaultActivePromptTitle(context))
            .toBe('Select up to 2 attachments');
        expect(CardSelector.for({ mode: TargetMode.UpTo, numCards: 1, cardType: CardType.Holding }).defaultActivePromptTitle(context))
            .toBe('Select a holding');
    });

    it('says cards for an up to selector of several types', function () {
        expect(CardSelector.for({ mode: TargetMode.UpTo, numCards: 3 }).defaultActivePromptTitle(context)).toBe('Select up to 3 cards');
    });

    it('gives a fixed and a variable count the same title', function () {
        const fixed = CardSelector.for({ mode: TargetMode.Exactly, numCards: 2, cardType: CardType.Character });
        const variable = CardSelector.for({ mode: TargetMode.ExactlyVariable, numCardsFunc: () => 2, cardType: CardType.Character });
        expect(fixed.defaultActivePromptTitle(context)).toBe('Choose 2 characters');
        expect(variable.defaultActivePromptTitle(context)).toBe('Choose 2 characters');
    });
});
