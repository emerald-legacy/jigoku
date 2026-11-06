import * as GameActions from '../../../build/server/game/GameActions/GameActions.js';

describe('an optional target hidden for having no legal target', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'brash-samurai']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer.declareAbilities(() => {
                this.whisperer.action('Test')
                    .target({
                        name: 'required',
                        cardType: 'character',
                        controller: 'self'
                    }, GameActions.honor())
                    .target({
                        name: 'optional',
                        cardType: 'character',
                        controller: 'self',
                        optional: true,
                        hideIfNoLegalTargets: true,
                        cardCondition: () => false
                    }, GameActions.honor())
                    .chatText('honor a character');
            });
        });

        it('does not restart targeting after the other target is chosen', function() {
            this.player1.clickCard(this.whisperer);
            this.player1.clickCard(this.brash);
            expect(this.brash.isHonored).toBe(true);
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});
