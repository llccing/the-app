import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

type Props = PropsWithChildren<{
  header?: ReactNode;
  footer?: ReactNode;
  headerHeight?: number;
  footerHeight?: number;
}>;

export default function FixedHeaderScrollView({
  children,
  header,
  footer,
  headerHeight = 250,
  footerHeight = 80,
}: Props) {
  return (
    <ThemedView style={styles.container}>
      {/* Fixed Header */}
      {header && (
        <View style={[styles.header, { height: headerHeight }]}>
          {header}
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView
        style={[
          styles.scrollView,
          {
            marginTop: header ? headerHeight : 0,
            marginBottom: footer ? footerHeight : 0,
          },
        ]}
        contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>{children}</ThemedView>
      </ScrollView>

      {/* Fixed Footer */}
      {footer && (
        <View style={[styles.footer, { height: footerHeight }]}>
          {footer}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
}); 