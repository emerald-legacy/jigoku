describe('Gift of Amaterasu', function() {
    integration(function() {
        describe('Gift of Amaterasu\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi','matsu-berserker'],
                        hand: ['gift-of-amaterasu']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['banzai']
                    }
                });
                this.toturi = this.player1.findCardByName('akodo-toturi');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.gift = this.player1.findCardByName('gift-of-amaterasu');
                this.whisperer = this.player2.findCardByName('doji-whisperer');

                this.noMoreActions();
            });

            describe('During a conflict', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        attackers: [this.toturi],
                        defenders: [this.whisperer]
                    });
                    this.player2.pass();
                    this.player1.pass();
                });

                it('should trigger if won  by 5 or more skill', function() {
                    this.player1.clickCard(this.gift);
                    expect(this.player1).toHavePrompt('Gift of Amaterasu');
                });

                it('should target correct characters', function() {
                    this.player1.clickCard(this.gift);
                    expect(this.player1).toBeAbleToSelect(this.toturi);
                    expect(this.player1).toBeAbleToSelect(this.berserker);
                    expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                });

                it('should honor selected character', function() {
                    this.player1.clickCard(this.gift);
                    this.player1.clickCard(this.toturi);
                    expect(this.toturi.isHonored).toBe(true);
                });
            });

            it('should not trigger if won by less than 5 skill', function() {
                this.initiateConflict({
                    attackers: [this.toturi],
                    defenders: [this.whisperer],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.getChatLogs(5)).toContain('player1 won a political conflict 3 vs 3');
                this.player1.clickCard(this.gift);
                expect(this.player1).not.toHavePrompt('Gift of Amaterasu');
                expect(this.gift.location).toBe('hand');
            });
        });

        describe('Gift of Amaterasu\'s skill difference', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi', 'matsu-berserker'],
                        hand: ['gift-of-amaterasu']
                    },
                    player2: {
                        inPlay: ['attendant-to-the-emperor', 'valiant-oathkeeper']
                    }
                });
                this.toturi = this.player1.findCardByName('akodo-toturi');
                this.gift = this.player1.findCardByName('gift-of-amaterasu');
                this.attendant = this.player2.findCardByName('attendant-to-the-emperor');
                this.oathkeeper = this.player2.findCardByName('valiant-oathkeeper');
                this.noMoreActions();
            });

            it('can be played after winning by exactly 5 skill', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toturi],
                    defenders: [this.attendant]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.getChatLogs(5)).toContain('player1 won a military conflict 6 vs 1');
                this.player1.clickCard(this.gift);
                expect(this.player1).toHavePrompt('Gift of Amaterasu');
                this.player1.clickCard(this.toturi);
                expect(this.toturi.isHonored).toBe(true);
            });

            it('cannot be played after winning by 4 skill', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.toturi],
                    defenders: [this.oathkeeper]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.getChatLogs(5)).toContain('player1 won a military conflict 6 vs 2');
                this.player1.clickCard(this.gift);
                expect(this.player1).not.toHavePrompt('Gift of Amaterasu');
                expect(this.gift.location).toBe('hand');
                expect(this.toturi.isHonored).toBe(false);
            });

            it('can be played after winning a conflict as the defender', function() {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.attendant],
                    defenders: [this.toturi]
                });
                this.player1.pass();
                this.player2.pass();
                expect(this.getChatLogs(5)).toContain('player1 won a military conflict 6 vs 1');
                this.player1.clickCard(this.gift);
                expect(this.player1).toHavePrompt('Gift of Amaterasu');
                this.player1.clickCard(this.toturi);
                expect(this.toturi.isHonored).toBe(true);
            });
        });
    });
});
