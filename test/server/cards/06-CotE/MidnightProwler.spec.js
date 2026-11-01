describe('Midnight Prowler', function() {
    integration(function() {
        describe('Midnight Prowler\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['midnight-prowler'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['ornate-fan', 'shrine-maiden']
                    }
                });
                this.fan = this.player2.findCardByName('ornate-fan');
                this.shrineMaiden = this.player2.findCardByName('shrine-maiden');
                this.player2.moveCard(this.fan, 'conflict deck');
                this.player2.moveCard(this.shrineMaiden, 'conflict deck');
                this.midnightProwler = this.player1.findCardByName('midnight-prowler');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['midnight-prowler'],
                    defenders: []
                });
            });

            it('should let you discard one of the top two cards of your opponents deck', function () {
                this.noMoreActions();
                this.player1.clickCard(this.midnightProwler);
                expect(this.player1).toHavePrompt('Which card do you want to discard?');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.getChatLogs(5)).toContain('player1 uses Midnight Prowler to look at the top two cards of player2\'s conflict deck');
                expect(this.getChatLogs(5)).toContain('player1 chooses to discard Ornate Fan');
                expect(this.fan.location).toBe('conflict discard pile');
                expect(this.shrineMaiden.location).toBe('conflict deck');
            });

            it('should let you keep both cards on top of your opponents deck', function () {
                this.noMoreActions();
                this.player1.clickCard(this.midnightProwler);
                expect(this.player1).toHavePrompt('Which card do you want to discard?');
                this.player1.clickPrompt('Do not discard either card');
                expect(this.fan.location).toBe('conflict deck');
                expect(this.shrineMaiden.location).toBe('conflict deck');
            });
        });
    });
});

describe('Midnight Prowler when not winning a military conflict', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['midnight-prowler'],
                    hand: []
                },
                player2: {
                    inPlay: ['matsu-berserker']
                }
            });
            this.midnightProwler = this.player1.findCardByName('midnight-prowler');
            this.noMoreActions();
        });

        it('should not trigger after winning a political conflict', function() {
            this.initiateConflict({
                type: 'political',
                attackers: ['midnight-prowler'],
                defenders: []
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a political conflict 1 vs 0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.midnightProwler);
        });

        it('should not trigger after losing a military conflict', function() {
            this.initiateConflict({
                type: 'military',
                attackers: ['midnight-prowler'],
                defenders: ['matsu-berserker']
            });
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 3 vs 2');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.midnightProwler);
        });
    });
});

describe('Midnight Prowler with an empty opponent conflict deck', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['midnight-prowler']
                },
                player2: {
                    inPlay: ['shinjo-outrider']
                }
            });
            this.midnightProwler = this.player1.findCardByName('midnight-prowler');
            this.player2.reduceDeckToNumber('conflict deck', 0);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.midnightProwler],
                defenders: []
            });
        });

        it('should not trigger, as there are no cards to look at', function() {
            this.noMoreActions();
            expect(this.player2.conflictDeck.length).toBe(0);
            expect(this.getChatLogs(10)).toContain('player1 won a military conflict 2 vs 0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
