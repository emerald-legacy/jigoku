describe('Daidoji Hiroteru', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['daidoji-hiroteru'],
                    dynastyDiscard: ['cautious-scout', 'daidoji-ahma', 'doji-whisperer'],
                    hand: ['adept-of-shadows', 'ornate-fan'],
                    fate: 10
                },
                player2: {
                    inPlay: ['brash-samurai']
                }
            });

            this.hiroteru = this.player1.findCardByName('daidoji-hiroteru');
            this.scout = this.player1.placeCardInProvince('cautious-scout', 'province 1');
            this.ahma = this.player1.placeCardInProvince('daidoji-ahma', 'province 2');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 3');
            this.shadows = this.player1.findCardByName('adept-of-shadows');
            this.fan = this.player1.findCardByName('ornate-fan');

            this.brash = this.player2.findCardByName('brash-samurai');
        });

        describe('the constant ability', function () {
            it('lets you see facedown cards in your own provinces', function () {
                this.scout.facedown = true;
                this.game.checkGameState(true);
                expect(this.scout.facedown).toBe(true);
                expect(this.scout.hideWhenFacedown()).toBe(false);
            });

            it('does not let you see facedown cards in an opponent\'s provinces', function () {
                const theirs = this.player2.player.getDynastyCardInProvince('province 1');
                theirs.facedown = true;
                this.game.checkGameState(true);
                expect(theirs.hideWhenFacedown()).toBe(true);
            });

            it('lets you play a faceup character from a province as if it were in your hand', function () {
                const fate = this.player1.fate;
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('0');
                expect(this.whisperer.location).toBe('play area');
                expect(this.player1.fate).toBe(fate - 1);
            });

            it('lets you play a facedown character from a province', function () {
                this.scout.facedown = true;
                this.game.checkGameState(true);
                const fate = this.player1.fate;
                this.player1.clickCard(this.scout);
                this.player1.clickPrompt('0');
                expect(this.scout.location).toBe('play area');
                expect(this.scout.facedown).toBe(false);
                expect(this.player1.fate).toBe(fate - 2);
            });

            it('does not discount the cost', function () {
                const fate = this.player1.fate;
                this.player1.clickCard(this.scout);
                this.player1.clickPrompt('0');
                expect(this.scout.location).toBe('play area');
                expect(this.player1.fate).toBe(fate - 2);
            });

            it('stops working once Hiroteru leaves play', function () {
                this.player1.player.moveCard(this.hiroteru, 'dynasty discard pile');
                this.game.checkGameState(true);
                this.scout.facedown = true;
                this.game.checkGameState(true);
                expect(this.scout.hideWhenFacedown()).toBe(true);
            });
        });

        describe('the covert reaction', function () {
            it('triggers after you play a Scout and grants covert for the phase', function () {
                this.player1.clickCard(this.scout);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.hiroteru);
                expect(this.scout.location).toBe('play area');
                expect(this.scout.hasKeyword('covert')).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Daidōji Hiroteru to give Cautious Scout covert until the end of the phase'
                );
            });

            it('triggers after you play a Shinobi', function () {
                this.player1.clickCard(this.ahma);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.hiroteru);
                expect(this.ahma.hasKeyword('covert')).toBe(true);
            });

            it('triggers for a Shinobi played from hand', function () {
                this.player1.clickCard(this.shadows);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.hiroteru);
                expect(this.shadows.location).toBe('play area');
                expect(this.shadows.hasKeyword('covert')).toBe(true);
            });

            it('does not trigger for a character without either trait', function () {
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('0');
                expect(this.player1).not.toBeAbleToSelect(this.hiroteru);
                expect(this.whisperer.hasKeyword('covert')).toBe(false);
            });

            it('does not trigger for a non-character card', function () {
                this.player1.clickCard(this.fan);
                this.player1.clickCard(this.brash);
                expect(this.fan.location).toBe('play area');
                expect(this.player1).not.toBeAbleToSelect(this.hiroteru);
            });

            it('does not trigger for an opponent\'s Scout or Shinobi', function () {
                this.player1.pass();
                this.player2.clickCard(this.brash);
                expect(this.player1).not.toBeAbleToSelect(this.hiroteru);
            });

            it('wears off at the end of the phase', function () {
                this.player1.clickCard(this.scout);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.hiroteru);
                expect(this.scout.hasKeyword('covert')).toBe(true);
                this.noMoreActions();
                this.nextPhase();
                expect(this.scout.hasKeyword('covert')).toBe(false);
            });
        });
    });
});
